const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function destroy(req, res, next) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204)
}

async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId)
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` })
}

async function update(req, res, next) {
  const time = new Date().toISOString();
  const { reviewId } = req.params;
  await service.update(req.body.data, reviewId)
  const dataNoTime = await service.updateWithCritic(reviewId)
  const data = {...dataNoTime, created_at: time, updated_at: time }
  res.json({ data })
}

module.exports = {
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
}