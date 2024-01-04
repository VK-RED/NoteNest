# NOTENEST 
NoteNest provide API endpoints for you to manage and share your notes with others.

### TECHSTACK
- [TypeScript](https://www.typescriptlang.org/)  - Language ( TypeScript for strict type checking )
- [Prisma](https://www.prisma.io/) - ORM ( Prisma makes it easier while migrating the DB )
- [PostgreSQL](https://www.postgresql.org/) - Database ( PostgreSQL offers robust relational data modeling, ideal for structured data )
- [Zod](https://zod.dev/) - Input Validation ( Zod validates the appropriate input schema and Error Handling )
- [Expressjs](https://expressjs.com/) - Framework ( Minimalist Nodejs backend framework )

### Local Setup

[yarn](https://yarnpkg.com/) has been used as the package manager

- Clone the project `git clone https://github.com/VK-RED/NoteNest`
- Move to the root folder `cd NoteNest`
- Setup Environment Variables `cp .env.example .env` and set your `DATABASE_URL` in `.env` file
- Install the required dependencies `yarn install`
- Apply prisma migrations `npx prisma migrate dev`
- Now run `yarn dev` to start the application

Now visit http://localhost:3000. You can see the app running.

### Contribution

If you feel any new feature (or) something is not working, feel free to raise an issue !

Thank you for your support !!!
