
const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  
  if (req.query.is_showing === "true") {
    res.json({ data: await service.listShowing() })
  } else {
    const data = await service.list()
    res.json({ data });
  }
}

async function listShowing(req, res, next) {
  res.json({ data: await service.listShowing()})
}

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId)
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

function read(req, res, next) {
  const { movie: data } = res.locals
  res.json({ data })
}

async function listTheatersForMovie(req, res, next) {
  res.json({ data: await service.listTheatersForMovie(req.params.movieId) })
}

async function listReviewsforMovie(req, res, next) {
  res.json({ data: await service.listReviewsforMovie(req.params.movieId) })
}

module.exports = {
  list: asyncErrorBoundary(list),
  listShowing: asyncErrorBoundary(listShowing),
  read: [asyncErrorBoundary(movieExists), read],
  listTheatersForMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheatersForMovie)
  ],
  listReviewsforMovie: [
    asyncErrorBoundary(movieExists), 
    asyncErrorBoundary(listReviewsforMovie)
  ],
}