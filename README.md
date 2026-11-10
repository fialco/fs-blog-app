# fs-blog-app

Blog app backend for [Full Stack Open part 13 relational databases](https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-relational-databases).

## Installation
1. Clone the repository
2. Create `.env` file in root directory. For local development, values for `.env` can be copied from [env.template](env.template).
3. Run:
```bash
npm install
```
## Usage
- Start the dev and test databases by running the following command in the root directory:

```
docker compose up
```
- Run the app in development mode with:
```
npm run dev
```
- Run the app in production mode with:
```
npm start
```
Now the app should be accessible with http://localhost:3001. For example, to get a list of all blogs, go to http://localhost:3001/api/blogs.

App can be also tested with API requests by using [api-requests.http](api-requests.http).

## Testing

- Start the app in testing mode with:
```
npm run start:test
```
- Run tests with
```
npm run test
```

