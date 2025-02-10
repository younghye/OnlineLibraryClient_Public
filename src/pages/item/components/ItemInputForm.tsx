import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useItemAttributesStore } from "hooks/store/useItemAttributesStore";
import { useItemStore } from "hooks/store/useItemStore";
import { TItem } from "schema/item";

interface Props {
  errors: FieldErrors<TItem>;
  register: UseFormRegister<TItem>;
}
export default function ItemInputForm({ errors, register }: Props) {
  const { types, categories, genres } = useItemAttributesStore();
  const { item, showUpdate } = useItemStore();
  const [selectType, setSelectType] = useState<string>("");

  const onChangeType = (event: any) => {
    setSelectType(event.target.value);
  };

  useEffect(() => {
    if (showUpdate && item) setSelectType(item.typeID.toString());
    // eslint-disable-next-line
  }, []);

  return (
    <div className="form-group text-start">
      <div className="row mb-2">
        <div className="col-md-4">
          <label htmlFor="type" className="control-label required">
            Type
          </label>
          <select
            className="form-select form-control"
            disabled={showUpdate}
            id="type"
            {...register("typeID")}
            onChange={onChangeType}
          >
            <option value=""> </option>
            {types.map((t) => (
              <option key={t.typeID} value={t.typeID}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.typeID && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.typeID.message}
            </p>
          )}
        </div>
        <div className="col-md-4">
          <label htmlFor="category" className="control-label required">
            Category
          </label>
          <select
            className="form-select form-control"
            id="category"
            {...register("categoryID")}
          >
            <option value=""> </option>
            {categories.map((c) => (
              <option key={c.categoryID} value={c.categoryID}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryID && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.categoryID.message}
            </p>
          )}
        </div>
        <div className="col-md-4">
          <label htmlFor="genre" className="control-label required">
            Genre
          </label>
          <select
            className="form-select form-control"
            id="genre"
            {...register("genreID")}
          >
            <option value=""> </option>
            {genres.map((g) => (
              <option key={g.genreID} value={g.genreID}>
                {g.name}
              </option>
            ))}
          </select>
          {errors.genreID && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.genreID.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-md-4">
          <label htmlFor="title" className="control-label required">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="col-md-4">
          <label htmlFor="producer" className="control-label required">
            {selectType === "1" ? "Author" : "Producer"}
          </label>
          <input
            type="text"
            className="form-control"
            id="producer"
            {...register("producer")}
          />
          {errors.producer && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.producer.message}
            </p>
          )}
        </div>
        <div className="col-md-4">
          <label htmlFor="publishDate" className="control-label required">
            Publish Date
          </label>
          <input
            type="date"
            className="form-control"
            id="publishDate"
            {...register("dateOfPublication")}
          />
          {errors.dateOfPublication && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.dateOfPublication.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-2">
        {selectType === "1" && (
          <div className="col-md-4">
            <label htmlFor="isbn" className="control-label required">
              ISBN
            </label>
            <input
              type="text"
              className="form-control"
              id="isbn"
              {...register("book.isbn")}
            />
            {errors.book?.isbn && (
              <p className="text-danger text-start w-100 m-0 text-wrap">
                {errors.book.isbn.message}
              </p>
            )}
          </div>
        )}

        {selectType === "1" && (
          <div className="col-md-4">
            <label htmlFor="publisher" className="control-label required">
              Publisher
            </label>
            <input
              type="text"
              className="form-control"
              id="publisher"
              {...register("book.publisher")}
            />
            {errors.book?.publisher && (
              <p className="text-danger text-start w-100 m-0 text-wrap">
                {errors.book.publisher.message}
              </p>
            )}
          </div>
        )}

        {selectType === "2" && (
          <div className="col-md-4">
            <label htmlFor="duration" className="control-label required">
              Duration
            </label>
            <input
              type="text"
              className="form-control"
              id="duration"
              {...register("dvd.duration")}
            />
            {errors.dvd?.duration && (
              <p className="text-danger text-start w-100 m-0 text-wrap">
                {errors.dvd.duration.message}
              </p>
            )}
          </div>
        )}
        {selectType === "2" && (
          <div className="col-md-4">
            <label htmlFor="director" className="control-label required">
              Director
            </label>
            <input
              type="text"
              className="form-control"
              id="director"
              {...register("dvd.director")}
            />
            {errors.dvd?.director && (
              <p className="text-danger text-start w-100 m-0 text-wrap">
                {errors.dvd.director.message}
              </p>
            )}
          </div>
        )}

        {selectType === "3" && (
          <div className="col-md-4">
            <label htmlFor="version" className="control-label required">
              Version
            </label>
            <input
              type="text"
              className="form-control"
              id="version"
              {...register("software.version")}
            />
            {errors.software?.version && (
              <p className="text-danger text-start w-100 m-0 text-wrap">
                {errors.software.version.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
