import { addFavorite, getUserFavoriteFiles, isFavorited, removeFavorite } from "./server"

const favorite = { addFavorite, isFavorited, removeFavorite, getUserFavoriteFiles }
export { favorite }