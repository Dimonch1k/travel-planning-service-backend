# Environment Setup

This project uses a `.env` file for configuration.
Copy the following template into a new file named **`.env`** in the root of the project and replace the placeholder values with your own:

```env
# Database connection
DATABASE_URL=postgresql://user:password@localhost:port/db-name?schema=public

# Server configuration
PORT=4200
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4200
NODE_ENV=development
ACCESS_ORIGINS=["http://localhost:3000"]

# JWT / Authentication settings
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRATION=604800        # in seconds
ACCESS_TOKEN_EXPIRATION_DAYS=7
ACCESS_TOKEN_NAME=accessToken

# Email settings
EMAIL_USER=user@gmail.com
ADMIN_EMAIL=user@gmail.com
EMAIL_PASS=
EMAIL_TOKEN_EXPIRATION_HOURS=1h
EMAIL_TOKEN_SECRET=
```

---

## Where to Put Your Data

- **Database connection**
  - Replace `user`, `password`, `port`, and `db-name` in `DATABASE_URL` with your actual PostgreSQL username, password, port (e.g. 5432), and database name.

- **JWT / Authentication secrets**
  - Generate random secrets for `ACCESS_TOKEN_SECRET` and `EMAIL_TOKEN_SECRET` using:

    ```bash
    openssl rand -hex 24
    ```

  - Copy each generated string into the corresponding field in your `.env`.

- **Email settings**
  - `EMAIL_USER` → the email account that will send messages (e.g. Gmail).
  - `ADMIN_EMAIL` → the administrator’s email address.
  - `EMAIL_PASS` → an **app password** created for your email provider (Gmail, Outlook, etc.).

    > Do **not** use your normal email password. In Gmail, go to _Manage your Google Account → Security → App Passwords_ to create one.

---

## After Filling `.env`

Once you’ve filled in all variables and created an app password for sending emails, run these commands **in order**:

```bash
bun install
bun prisma generate
bun prisma db push
```

To start the development server:

```bash
bun start:dev
```
