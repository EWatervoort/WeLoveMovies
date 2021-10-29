const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties")

const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
})

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

function update(updatedReview, review_id) {
  return knex("reviews")
    .select("*")
    .where({ review_id })
    .update(updatedReview)
    .then((updatedRecords) => updatedRecords[0]);
}

function updateWithCritic(review_id) {
  return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({ review_id })
    .first()
    .then(addCritic)
}

function read(review_id) {
  return knex("reviews")
    .select("*")
    .where({ "review_id": review_id })
    .first()
}

module.exports = {
  delete: destroy,
  update,
  read,
  updateWithCritic,
}