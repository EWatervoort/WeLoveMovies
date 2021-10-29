const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties")

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
})

function list() {
  return knex("movies").select("*");
}

function listShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .distinct("m.*")
    .where( "mt.is_showing", true )

}

function read(movie_id) {
  return knex("movies").select("*").where({ movie_id }).first();
}

function listTheatersForMovie(movie_id) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .where({ "m.movie_id": movie_id })
    .where("mt.is_showing", true )
    .select("t.*", "mt.*")
}

function listReviewsforMovie(movie_id) {
  return knex("movies as m")
    .join("reviews as r", "r.movie_id", "m.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("r.*","c.*")
    .where({ "m.movie_id": movie_id })
    .then((data) => {
      return Promise.all(data.map(addCritic))
    })
}

module.exports = {
  list,
  listShowing,
  read,
  listTheatersForMovie,
  listReviewsforMovie,
}