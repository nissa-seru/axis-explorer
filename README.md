# Assistant Axis Explorer

An interactive scatter plot of role activation vectors from two models, Kimi K2.5 and Qwen 3 32B. Each role is a point. In the "Paper's 275" role set, for example, the role `chef` has the description "You are a chef with extensive culinary expertise and passion for creating delicious dishes." The plot places each role by its scores on two of six axes: the first five principal components (PC1 to PC5) and a contrast axis. A red star labelled DEFAULT marks the model with no system prompt.

This repository holds the viewer and its precomputed data, with a small Node server to run it.

## What's here

- `index.html` is the viewer, a single page that draws the plot with Plotly. It loads Plotly from cdn.plot.ly, so the viewer needs internet access.
- `data/viewer_data.json` holds the four datasets described below.
- `server.js` serves the page and its data, and `package.json` runs it as `npm start`.
- `Dockerfile` runs `server.js` on Node 22.

## The data

There is one dataset for each model and role set:

| Dataset | Model | Role set | Roles |
| --- | --- | --- | --- |
| `k25_275` | Kimi K2.5 (1T MoE) | Paper's 275 | 275 |
| `k25_500` | Kimi K2.5 (1T MoE) | 500 Diverse | 500 |
| `qwen_275` | Qwen 3 32B (Dense) | Paper's 275 | 275 |
| `qwen_500` | Qwen 3 32B (Dense) | 500 Diverse | 500 |

Each role has its description and its score and percentile on each axis. In the two K2.5 datasets, each role also has one to three questions with the model's response as that role.

## Using the viewer

Pick a dataset, then the axes for X, Y and color. Typing in the search box highlights the roles whose names contain the text. Clicking a role shows its description, its scores and percentiles, and in the K2.5 datasets its example responses. With the contrast axis on X or Y, a dashed line marks the 25th percentile of the roles' contrast scores.

## Running it

The page fetches its data file, so serve it over HTTP rather than opening `index.html` from disk. The server uses only Node's built-in modules, so there is nothing to install:

```sh
npm start
```

Then open http://localhost:3000. The server listens on every network interface, at port 3000 unless you set `PORT`. When you set `SITE_PASSWORD`, the server asks for HTTP basic auth with that password and the user name `admin` or an empty one.

In the Docker image, the server listens on port 3000. This publishes it on the loopback address only:

```sh
docker build -t axis-explorer .
docker run -p 127.0.0.1:3000:3000 axis-explorer
```

Then open http://127.0.0.1:3000. To require the password there, add `-e SITE_PASSWORD=...` to `docker run`.

A static file server run from the repository's root also works, without the password check, such as `python3 -m http.server --bind 127.0.0.1` (then open http://127.0.0.1:8000).
