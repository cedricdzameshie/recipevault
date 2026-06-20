# RecipeVault

RecipeVault is a full-stack recipe management and cooking application built for everyday household use.

It allows users to create, organize, import, edit, and cook recipes through a mobile-friendly interface. The project is designed as a real production application, not just a portfolio mockup.

## Live Application
## Deployment

RecipeVault is deployed as a private production application on a Raspberry Pi and secured through Cloudflare Tunnel and Cloudflare Access.

Access is limited to approved household users. A public demo is not currently available because the application contains private household recipes and data.


## Features

### Recipe Management

* Create, edit, view, and delete recipes
* Add recipe descriptions, servings, prep time, and cook time
* Organize recipes into folders
* Mark recipes as favorites
* Add notes to recipes
* Import recipes using AI

### Ingredients

* Add quantities, units, and ingredient names
* Edit and remove ingredients
* View compact ingredient summaries
* Collapse ingredient sections while editing

### Cooking Steps

* Add multiple cooking steps
* Add optional prep notes
* Add suggested timers
* Assign ingredients to individual steps
* Collapse and expand individual steps
* View compact step summaries
* Use step-by-step Cooking Mode

### Mobile Experience

* Responsive mobile-first layout
* Mobile-friendly form controls
* Improved touch targets
* iPhone Safari compatibility
* Local mobile-development testing support

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express
* Prisma ORM

### Database

* PostgreSQL

### Infrastructure

* Raspberry Pi 5
* PM2
* Cloudflare Tunnel
* Cloudflare Access
* Docker
* GitHub

## Project Structure

```text
recipevault/
├── client/          React frontend
├── server/          Express API and Prisma
├── docs/            Project and database documentation
└── package.json     Root development scripts
```

## Local Development

### Requirements

* Node.js
* npm
* PostgreSQL
* A configured server `.env` file
* A configured client `.env` file

### Install dependencies

From the project root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### Start development mode

```bash
npm run dev
```

This starts both:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:4000
```

### Mobile testing on the local network

The Vite development server is configured to allow access from another device on the same network.

Open the laptop’s local IP address on the mobile device:

```text
http://YOUR_LAPTOP_IP:5173
```

The backend CORS configuration must allow the local mobile-development origin through:

```env
LOCAL_CLIENT_URL=http://YOUR_LAPTOP_IP:5173
```

## Environment Variables

### Client

Example:

```env
VITE_API_BASE_URL=/api
```

### Server

Example:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/recipevault
CLIENT_URL=http://localhost:5173
LOCAL_CLIENT_URL=http://YOUR_LAPTOP_IP:5173
```

Do not commit real `.env` files or secrets.

## Database Commands

Generate the Prisma client:

```bash
cd server
npx prisma generate
```

Create a development migration:

```bash
npx prisma migrate dev
```

Apply migrations in production:

```bash
npx prisma migrate deploy
```

Never use `prisma migrate reset` against the production database.

## Production Deployment

RecipeVault is deployed on a Raspberry Pi and exposed securely through Cloudflare Tunnel.

Typical deployment workflow:

```bash
cd ~/projects/recipevault
git switch main
git pull origin main

npm ci --prefix server
npm ci --prefix client

cd server
npx prisma migrate deploy
npx prisma generate
cd ..

npm run build --prefix client
pm2 restart recipevault
pm2 status
```

## Release History

### v1.1.0

* Added step-specific ingredients
* Added prep notes and suggested timers
* Added collapsible Recipe Basics, Ingredients, and Steps sections
* Improved mobile form usability
* Added local mobile-development support
* Improved recipe editing workflow

## Planned Improvements

* Cooking Focus Mode
* Ingredient checkboxes during cooking
* Recipe batch scaling
* Step reordering
* Create folders while adding recipes
* Normalize imported measurement units
* Household chalkboard
* Household quotes
* Recipe photos
* Recipe comments

## Development Goals

RecipeVault is being developed as a production-style application with focus on:

* Stability
* Mobile usability
* Data safety
* Clear deployment workflows
* Database backups
* Monitoring
* User feedback
* Incremental releases

## Author

Built by **Cedric Dzameshie**

* Portfolio: https://dzameshie.dev
* GitHub: https://github.com/cedricdzameshie
