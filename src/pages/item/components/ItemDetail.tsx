import moment from "moment";
import { TItem } from "schema/item";

interface Props {
  item: TItem;
  page: string;
}
export default function ItemDetail({ item, page }: Props) {
  return (
    <>
      <div className="row">
        <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
          Title
        </div>
        <div className="col-lg-4 col-md-4 col-sm-9 col-8">{item.title}</div>
        <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
          {item.typeID === 1 ? "Author" : "Producer"}
        </div>
        <div className="col-lg-4 col-md-4 col-sm-9 col-8">{item.producer}</div>
      </div>
      <div className="row">
        <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
          Type
        </div>
        <div className="col-lg-4 col-md-4 col-sm-9 col-8">
          {item.type?.name}
        </div>
        <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
          Category
        </div>
        <div className="col-lg-4 col-md-4 col-sm-9 col-8">
          {item.category?.name}
        </div>
      </div>
      {page === "item" && (
        <div className="row">
          <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
            Genre
          </div>
          <div className="col-lg-4 col-md-4 col-sm-9 col-8">
            {item.genre?.name}
          </div>
          <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
            Publish Date
          </div>
          <div className="col-lg-4 col-md-4 col-sm-9 col-8">
            {moment(item.dateOfPublication).format("DD/MM/YYYY")}
          </div>
        </div>
      )}
      {item.typeID === 1 && (
        <div className="row">
          <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
            ISBN
          </div>
          <div className="col-lg-4 col-md-4 col-sm-9 col-8">
            {item.book?.isbn}
          </div>
          <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
            Publisher
          </div>
          <div className="col-lg-4 col-md-4 col-sm-9 col-8">
            {item.book?.publisher}
          </div>
        </div>
      )}
      {item.typeID === 2 && (
        <div className="row">
          <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
            Duration
          </div>
          <div className="col-lg-4 col-md-4 col-sm-9 col-8">
            {item.dvd?.duration}
          </div>
          <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
            Director
          </div>
          <div className="col-lg-4 col-md-4 col-sm-9 col-8">
            {item.dvd?.director}
          </div>
        </div>
      )}
      {item.typeID === 3 && (
        <div className="row">
          <div className="col-lg-2 col-md-2 col-sm-3 col-4 fw-bold mb-3">
            Version
          </div>
          <div className="col-lg-4 col-md-4 col-sm-9 col-8">
            {item.software?.version}
          </div>
        </div>
      )}
    </>
  );
}
