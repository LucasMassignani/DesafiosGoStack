const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepositoriesExists(request, response, next) {
  const {id} = request.params

  const repositoryIndex = repositories.findIndex(r => r.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({message: 'Repository does not exist'});
  }

  request.repositoryIndex = repositoryIndex
  
  return next();
}

app.use('/repositories/:id', checkRepositoriesExists)

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body;
  
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);
  
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {title,url,techs} = request.body;

  const {repositoryIndex} = request;

  const repository = repositories[repositoryIndex]
  
  if (title){
    repository.title = title;
  }
  
  if (url){
    repository.url = url;
  }

  if (techs){
    repository.techs = techs;
  }

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {repositoryIndex} = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json()
});

app.post("/repositories/:id/like", (request, response) => {
  const {repositoryIndex} = request

  const repository = repositories[repositoryIndex]

  repository.likes++;

  return response.json(repository)
});

module.exports = app;
