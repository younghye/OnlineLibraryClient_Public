import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { useItemAttributesStore } from "hooks/store/useItemAttributesStore";
import Loading from "./common/Loading";
import axios from "api/axios";

export default function Home() {
  const { types, categories, genres, setTypes, setCategories, setGenres } =
    useItemAttributesStore();

  const [typeQuery, genreQuery, categoryQuery] = useQueries({
    queries: [
      {
        queryKey: ["getType"],
        queryFn: () => axios.get("/Master/GetType").then((res) => res.data),
        enabled: types.length === 0,
      },

      {
        queryKey: ["getGenre"],
        queryFn: () => axios.get("/Master/GetGenre").then((res) => res.data),
        enabled: genres.length === 0,
      },
      {
        queryKey: ["getCategory"],
        queryFn: () => axios.get("/Master/GetCategory").then((res) => res.data),
        enabled: categories.length === 0,
      },
    ],
  });

  useEffect(() => {
    if (categoryQuery.data) setCategories(categoryQuery.data);
    if (typeQuery.data) setTypes(typeQuery.data);
    if (genreQuery.data) setGenres(genreQuery.data);
  }, [
    categoryQuery.data,
    typeQuery.data,
    genreQuery.data,
    setCategories,
    setTypes,
    setGenres,
  ]);

  if (categoryQuery.isLoading || typeQuery.isLoading || genreQuery.isLoading)
    return <Loading />;

  return <div className="background home-background"></div>;
}
