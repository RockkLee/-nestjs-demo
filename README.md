# nestjs-demo
## Overview
- This app is a demonstration of how to use NodeJS, NestJS, and NPM Monorepo to implement a simple CRUD app with DDD concepts, especially separating domain logic from infrastructure code.

## Structure
```bash
sheng@MSI:nestjs-demo$ tree ./ -I "node_modules|dist"
./
├── README.md
├── app
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── app.svc
│   │   │   └── user.app.svc.ts
│   │   ├── index.ts
│   │   ├── port
│   │   │   └── repo
│   │   │       └── user.repo.ts
│   │   └── temp.ts
│   ├── tsconfig.json
│   └── tsconfig.tsbuildinfo
├── database.sqlite
├── domain
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── domain.svc
│   │   │   └── user.domain.svc.ts
│   │   ├── entity
│   │   │   └── user.ts
│   │   ├── index.ts
│   │   └── valueobj
│   ├── tsconfig.json
│   └── tsconfig.tsbuildinfo
├── infra
│   ├── README.md
│   ├── database.sqlite
│   ├── nest-cli.json
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── adapter
│   │   │   └── repo.impl
│   │   │       └── user.repo.impl.ts
│   │   ├── app.controller.spec.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── controller
│   │   │   └── user.controller.ts
│   │   ├── helper
│   │   │   ├── dto
│   │   │   │   ├── req
│   │   │   │   │   └── user.req.ts
│   │   │   │   └── resp
│   │   │   │       └── user.resp.ts
│   │   │   ├── helper
│   │   │   └── util
│   │   │       └── mapper
│   │   │           └── user.po.mapper.ts
│   │   ├── main.ts
│   │   ├── module
│   │   │   └── user.module.ts
│   │   └── po
│   │       └── user.po.ts
│   ├── test
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── tsconfig.build.json
│   ├── tsconfig.build.tsbuildinfo
│   └── tsconfig.json
├── package-lock.json
├── package.json
└── tsconfig.json
```

<br>

## Explanation of package.json and tsconfig.json files
- package.json:
```json
{
  "name": "nestjs-demo", // The name of the project
  "version": "1.0.0", // The version of the project
  "private": true, // The project is private and won't be published to the npm registry
  "workspaces": [ // Defines the packages within the monorepo (workspaces) 
    "infra",
    "app",
    "domain"
  ],
  ...
  "scripts": {
    // Build all workspaces: domain, app, and infra, in that order
    "_build": "npm run build --workspace=domain && npm run build --workspace=app && npm run build --workspace=infra",
    // Start the infra workspace (usually the NestJS application) using the default start command
    "_start": "npm run start --workspace=infra",
     // Start the infra workspace using ts-node and tsconfig-paths for runtime TypeScript execution with path aliasing
    "_start:ts-node": "ts-node -r tsconfig-paths/register -P infra/tsconfig.json infra/src/main.ts"
  }
}
```

- tsconfig.json:
```json
{
    "compilerOptions": {
         // Enables support for project references
        "composite": true, // Required for project references
        "module": "commonjs", // Specify the module system of the compiled output JS files
        "target": "ES6", // Specify the version of the output compiled JS files
        // "declaration": true, //Generate declaration files
        // "declarationMap": true, // Generate source maps for declaration files.
        "moduleResolution": "node",  // Defines how modules are resolved. "node" means the TypeScript compiler will mimic Node.js behavior.
        "skipLibCheck": true // Skips type-checking of declaration files (.d.ts) in node_modules, speeding up compilation.
    },
    "references": [
        { "path": "./app" },
        { "path": "./domain" },
        { "path": "./infra" }
    ]
}
```

- infra/package.json:
```json
{
  "name": "@nestjs-demo/infra",
  "version": "1.0.0",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    // Command to build the NestJS project and replace path aliases with real paths 
    // by using `tsc-alias` for absolute imported paths
    "build": "nest build && tsc-alias",
    ...
    "start": "nest start",
    ...
  },
  ...
  "dependencies": {
    ...
    "@nestjs-demo/infra": "file:",
    "@nestjs-demo/app": "1.0.0", // import the app sub-module
    ...
  },
  ...
}
```

- infra/tsconfig.json:
```json
{
  "extends": "../tsconfig.json", // Inherits settings from the root tsconfig.json file
  "compilerOptions": {
    "emitDecoratorMetadata": true, // Enables metadata reflection for decorators, needed by NestJS for dependency injection
    "experimentalDecorators": true, // Enables the use of decorators, a feature used extensively by NestJS
    // Allow writing import syntax like this `import React from "react";` rather than `import * as React from "react";`
    "allowSyntheticDefaultImports": true,
    "outDir": "./dist", // Specifies the output directory for compiled files
    "rootDir": "./src", // Specifies the root directory of input source files for compiling TS files to JS files
    ///////////////////////////////
    // The map of absolute imported paths:
    // - For type aliases: Maps the paths in TS files to the compiled JS files in the 'dist' directory (after compiling TS files to JS files, then running the JS files).
    // - For ts-node: Maps the paths directly when running TS files without compilation.
    "baseUrl": "./src",
    "paths": {
      "@nestjs-demo/infra/*": ["./*"],
      "@nestjs-demo/app/*": ["../../app/dist/*"],
      "@nestjs-demo/domain/*": ["../../domain/dist/*"]
    },
    ///////////////////////////////
    "noEmit": false, // Enable/Disable code emission, i.e., allows TypeScript to generate output files
    "strictNullChecks": false, // Enable/Disable strict null checks
    "noImplicitAny": false, // Enable/Disable error reporting for variables typed as `any`
    "strictBindCallApply": false, // Enable/Disable strict checking of function arguments, i.e., `bind`, `call`, and `apply`
    "forceConsistentCasingInFileNames": false, // Enable/Disable consistent casing of filenames between imports and file system
    "noFallthroughCasesInSwitch": false 
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../app" },
    { "path": "../domain" }
  ]
}
```

<br>

## TODO LIST:
- It turns out that the app sub-module might also need to be a NestJS module because:
    - If I don't make the app sub-module a NestJS module, I will need to manually inject all dependencies in the app sub-module, or at least every dependency related to the infra code.
    - The code below demonstrates how to manually inject the dependencies.
```typescript
// Example of a factory provider in your UserModule
@Module({
  imports: [TypeOrmModule.forFeature([UserPo])],
  controllers: [UserController],
  providers: [
    {
      provide: UserAppSvc,
      useFactory: (
        userRepo: UserRepo,
        userDomainSvc: UserDomainSvc,
      ) => {
        return new UserAppSvc(userRepo, userDomainSvc);
      },
      inject: [UserRepoImpl, UserDomainSvc],
    },
    UserDomainSvc,
    { provide: 'UserRepository', useClass: UserRepoImpl },
  ],
})
export class UserModule {}
```
- In the current structure, I'm not sure why the infra sub-module can use type-aliases to map the imported paths but the app sub-module can't.
    - The chart below demonstrates the issue.
```
            ----------------------------------------------------------
           | - Map imported paths from its own module: `type-aliases` |
infra -----| - Map imported paths from other modules: `type-aliases`  |
  |        |                                                          |
  |         ----------------------------------------------------------
  |       
  |         ------------------------------------------------------------------------------
  V        | - Map imported paths from its own module: `type-aliases`                     |
 app ------| - Map imported paths from other modules: `exports` (in domain/package.json)  |
  |        |                                                                              |
  |         ------------------------------------------------------------------------------
  V
domain
```