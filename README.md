# Rebuiltron

A tool made to easily build an offline **React/Electron** app using webpack.

---

## Why

The idea behind Rebuiltron was to migrate one of my project initially created with the deprecated [CRA](https://create-react-app.dev/) to a maintained tool configured with Electron in mind. As such, it has been developed using [react-scripts](https://github.com/facebook/create-react-app/tree/main/packages/react-scripts) as a base, but heavily edited and stripped of a lot of features.

> [!IMPORTANT]
> Since I made Rebuiltron specifically for one of my own projects, I only kept in the configuration what *this* project needed and nothing more. Except for the entry points and some SASS options, **Rebuiltron doesn't offer any configurable options**. If you are looking to create a new Electron/React app, or even migrating an existing CRA app, you should probably take a look at [electron-vite](https://electron-vite.org/) instead.


## Features

Rebuiltron uses webpack with [SWC](https://swc.rs/) to compile JavaScript instead of [Babel](https://babeljs.io/).

- Support for multiple windows and preloads
- Development server taking care of starting Electron
- Production bundler for React and Electron code
- Support for React, JSX, SASS, ICSS

> [!WARNING]
> Rebuiltron **doesn't support**: TypeScript, Flow, CSS Modules, Jest, and proxying.


## Installation

```shell
yarn add rebuiltron -D
```

[**React**](https://react.dev/) and [**Electron**](https://www.electronjs.org/) are required dependencies you must install separately.

## Configuration

The following documentation assume you already have a basic knowledge of how to use React and Electron.

### Folder structure

Rebuiltron expects the following folder structure:

```shell
my-app
├── electron/
│   └── # Main and preload files
├── public/
│   └── # Renderer HTML file(s)
├── src/
│   └── # Renderer JS file(s)
└── package.json
```

### Main entry
Set the main Electron entry in `package.json`:

```json
{
  "main": "electron/main.js",
}
```

### Scripts
Add Rebuiltron scripts:

```json
{
  "start": "rebuiltron start",
  "build": "rebuiltron build",
}
```

The `build` command will bundle your code so it's ready for production, but **it will not package it into a working app**. For this task, you need to use a tool such as [Electron Forge](https://www.electronforge.io/) or [electron-builder](https://www.electron.build/index.html).

### Browserslist

Add your desired [browserslist](https://github.com/browserslist/browserslist) in `package.json`:

```json
{
  "browserslist": "last 2 electron major versions",
}
```

### Configuration file

At the root of your project, create a `rebuiltron.config.js` file.

#### Options:

| Option | Type | Required | Description |
| --- | :---: | :---: | --- |
| `renderers` | `object` | ✓ | Renderer entries. It takes the name of the entries as keys and their paths as values. |
| `preloads` | `object` | ✓ | Preload entries. It takes the name of the entries as keys and their paths as values. |
| `srcAlias` | `string` | ✗ | Custom [alias](https://webpack.js.org/configuration/resolve/#resolvealias) to the `src` folder.
| `sassOptions` | `object` | ✗ | Custom SASS options for [`sass-loader`](https://github.com/webpack-contrib/sass-loader). |
| `sassOptions.additionalData` | `object` | ✗* | Configuration of [`additionalData`](https://webpack.js.org/loaders/sass-loader/#additionaldata). |
| `sassOptions.additionalData.data` | `string` | ✗* | Data to prepend to SASS files. |
| `sassOptions.additionalData.exclude` | `Regex` | ✗* | Regex matching the files to exclude from `additionalData`. This is necessary to prevent an `@import loop` error. |

<sup>*Required when `sassOptions` is defined.</sup>

#### Example:

```js
module.exports = {
  renderers: {
    app: "./src/app.js",
    worker: "./src/worker.js"
  },
  preloads: {
    worker: "./electron/preloads/worker.js"
  },
  srcAlias: "@app",
  sassOptions: {
    additionalData: {
      data: "@use \"styles/settings\" as *;",
      exclude: /^src\\styles\\.*/
    }
  }
};
```

> [!NOTE]
> Your renderers entry file(s) will be automatically injected into your HTML file(s). Thus, make sure you have a corresponding HTML file in the `public` folder for each entry (using the same name).

### Environment variables

When the development server is running, Rebuiltron exposes a `DEV_LOCAL_URL` variable that you can access on your main process using `process.env.DEV_LOCAL_URL`.

```js
if(!app.isPackaged) {
  appWindow.loadURL(`${process.env.DEV_LOCAL_URL}/index.html`);
}
```

## Usage

To run the development server:

```shell
yarn start
```

To create the production build:

```shell
yarn build
```

## Contributing and feature requests

I made Rebuiltron specifically for a project of mine, and for that reason, **I have no plans to add new features nor to accept contributions**, unless required for this project in particular. If you wish to use Rebuiltron but need something that is not available in the current configuration, please feel free to create a fork and change the code to your needs.

## License
MIT
