# Elysia SDK

TypeScript SDK для интеграции приложений с экосистемой Elysia. Репозиторий организован как pnpm-монорепозиторий и состоит из независимого от фреймворков ядра и дополнительного пакета интеграции с React.

> **Статус:** в разработке. Публичный API может измениться до первого стабильного релиза.

## Пакеты

| Пакет | Описание |
| --- | --- |
| [`@elysiac/sdk`](./packages/sdk) | Ядро SDK, не зависящее от фреймворков: HTTP-клиенты, интеграция с хранилищем токенов, API-модули и нормализация ошибок. |
| [`@elysiac/sdk-react`](./packages/react) | Интеграция с React: `ElysiaProvider` и хуки TanStack Query для работы с ядром SDK. |

Ядро SDK не зависит от React. Используйте его напрямую в TypeScript-приложениях или установите React-пакет для React-приложений.

## Требования

- Node.js 24 или новее
- pnpm 11 или новее
- TypeScript 5.9 или новее

## Установка

Установите основной пакет:

```bash
pnpm add @elysiac/sdk
```

Для React-приложений также установите пакет интеграции и его peer dependencies:

```bash
pnpm add @elysiac/sdk @elysiac/sdk-react @tanstack/react-query react
```

React-пакет ожидает, что приложение самостоятельно предоставит `QueryClientProvider` из TanStack Query. SDK не создаёт и не управляет глобальным `QueryClient`.

## Core SDK

### Создание клиента

Создайте экземпляр `ElysiaClient` и передайте ему реализацию `TokenStorage`. SDK не определяет, где хранить токены: сохранение данных и управление сессиями остаются ответственностью приложения.

```ts
import { ElysiaClient, type TokenStorage } from '@elysiac/sdk';

const tokenStorage: TokenStorage = {
  getAccessToken: () => yourTokenStore.getAccessToken(),
  setAccessToken: (token) => yourTokenStore.setAccessToken(token),
  getRefreshToken: () => yourTokenStore.getRefreshToken(),
  clearAccessToken: () => yourTokenStore.clearAccessToken(),
};

export const elysia = new ElysiaClient({
  baseURL: 'https://gateway.elysiac.fun',
  tokenStorage,
});
```

Методы `TokenStorage` могут возвращать как обычное значение, так и `Promise`. Поэтому реализация хранилища может быть синхронной или асинхронной.

`yourTokenStore` в примере — это условное обозначение хранилища, которое реализуется на стороне приложения. Оно не входит в SDK.

### Auth API

Методы авторизации доступны через `client.auth`:

```ts
const result = await elysia.auth.login({
  login: 'user',
  password: 'password',
});

const registration = await elysia.auth.register({
  login: 'new-user',
  email: 'user@example.com',
  password: 'password',
});

const confirmed = await elysia.auth.confirmEmail({
  email_verefication_token: registration.email_verefication_token,
  code: '123456',
});
```

Доступные методы:

- `login(data)`
- `register(data)`
- `confirmEmail(data)`
- `resendEmail(data)`
- `refresh(data)`
- `checkRefreshToken(data)`
- `createChildToken(data)`
- `clientInfo(data)`
- `refreshPassword(data)`
- `getMyIntegrations()`

Методы авторизации возвращают содержимое поля `data` ответа endpoint. Методы, backend-ответ которых не содержит полезной нагрузки в `data`, например `resendEmail` и `checkRefreshToken`, возвращают полный объект `SuccessResponse<null>`.

Приложение самостоятельно определяет, как сохранять или заменять refresh-токены, возвращаемые методами авторизации. SDK не реализует переключение аккаунтов, UI-редиректы, уведомления или специфичное для приложения управление состоянием сессии.

### Users API

Методы для работы с пользователем доступны через `client.users`:

```ts
const profile = await elysia.users.me();
const nameHistory = await elysia.users.getMyNameHistory();
const updatedName = await elysia.users.updateMyName({ name: 'NewName' });
```

Доступные методы:

- `me()`
- `getMyNameHistory()`
- `updateMyName(data)`

### HTTP-клиенты

Исходные экземпляры Axios доступны через `client.http`:

```ts
elysia.http.ssoApi;
elysia.http.api;
```

Для поддерживаемых endpoint используйте API-модули. Исходные HTTP-клиенты доступны для запросов, для которых в SDK пока нет отдельного метода.

### Ошибки

Ошибки запросов SDK нормализуются в экземпляры `ElysiaError`:

```ts
import { ElysiaError } from '@elysiac/sdk';

try {
  await elysia.users.me();
} catch (error) {
  if (error instanceof ElysiaError) {
    console.error(error.code);
    console.error(error.status);
    console.error(error.traceId);
    console.error(error.details);
  }
}
```

`ElysiaError` содержит следующие свойства:

| Свойство | Описание |
| --- | --- |
| `message` | Понятное человеку описание ошибки. |
| `code` | Код ошибки backend или код, сформированный SDK. |
| `status` | HTTP-статус, если сервер вернул ответ. |
| `traceId` | Идентификатор трассировки backend, если он доступен. |
| `details` | Дополнительная информация об ошибке от backend, если она передана. |
| `cause` | Исходная ошибка, если она доступна. |

SDK не определяет, как приложение должно реагировать на ошибки авторизации. Очистка сессий приложения, перенаправление пользователя и отображение уведомлений остаются ответственностью приложения.

## Интеграция с React

### Подключение провайдеров

Создайте экземпляр основного клиента и передайте его в `ElysiaProvider`. Приложение также должно предоставить `QueryClientProvider` из TanStack Query.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { ElysiaClient, type TokenStorage } from '@elysiac/sdk';
import { ElysiaProvider } from '@elysiac/sdk-react';

const queryClient = new QueryClient();

const tokenStorage: TokenStorage = {
  getAccessToken: () => yourTokenStore.getAccessToken(),
  setAccessToken: (token) => yourTokenStore.setAccessToken(token),
  getRefreshToken: () => yourTokenStore.getRefreshToken(),
  clearAccessToken: () => yourTokenStore.clearAccessToken(),
};

const elysia = new ElysiaClient({
  baseURL: 'https://gateway.elysiac.fun',
  tokenStorage,
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ElysiaProvider client={elysia}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ElysiaProvider>
  );
}
```

### Использование хуков

Для действий авторизации используются мутации TanStack Query:

```tsx
import { useLogin } from '@elysiac/sdk-react';

function LoginButton() {
  const login = useLogin();

  return (
    <button
      onClick={() =>
        login.mutate({ login: 'user', password: 'password' })
      }
      disabled={login.isPending}
    >
      Войти
    </button>
  );
}
```

Для получения профиля пользователя используется query:

```tsx
import { useMe } from '@elysiac/sdk-react';

function Profile() {
  const { data, isPending, error } = useMe();

  if (isPending) return <p>Загрузка...</p>;
  if (error) return <p>{error.message}</p>;

  return <p>{data.name}</p>;
}
```

### Доступные React-хуки

**Авторизация**

- `useLogin`
- `useRegister`
- `useConfirmEmail`
- `useResendEmail`
- `useRefresh`
- `useCheckRefreshToken`
- `useCreateChildToken`
- `useGetClientInfo`
- `useGetMyIntegrations`
- `useRefreshPassword`

**Пользователи**

- `useMe`
- `useGetMeNameHistory`
- `useUpdateMyName`

Хуки мутаций и запросов принимают стандартные параметры TanStack Query, за исключением `queryKey` и функций `queryFn` / `mutationFn`, которыми управляет SDK. `useGetClientInfo` принимает аргумент `clientId`. Для `useMe` и других query-хуков можно задавать параметры вроде `enabled`, `staleTime` и `select`.

## Разработка

В репозитории используется pnpm workspaces.

```bash
pnpm install
pnpm build
pnpm typecheck
```

Запуск тестов основного SDK:

```bash
pnpm --filter @elysiac/sdk test
```

Создание changeset для релиза:

```bash
pnpm changeset
```

Применение ожидающих changeset: обновление версий пакетов и changelog:

```bash
pnpm changeset version
```

Публикация пакетов после проверки метаданных, доступа к npm и подготовленных версий:

```bash
pnpm changeset publish
```

## Структура проекта

```text
packages/
├── sdk/
│   └── src/
│       ├── api/
│       │   ├── auth/
│       │   └── users/
│       ├── client/
│       ├── errors/
│       ├── http/
│       ├── storage/
│       ├── types/
│       └── index.ts
└── react/
    └── src/
        ├── hooks/
        │   ├── auth/
        │   └── users/
        ├── context.ts
        ├── ElysiaProvider.tsx
        └── index.ts
```
