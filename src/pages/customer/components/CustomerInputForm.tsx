import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TCustomer } from "schema/person";

interface Props {
  errors: FieldErrors<TCustomer>;
  register: UseFormRegister<TCustomer>;
}
export default function CustomerInputForm({ errors, register }: Props) {
  return (
    <div className="form-group text-start">
      <div className="row mb-2">
        <div className="col-md-6">
          <label htmlFor="firstName" className="control-label required">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            {...register("person.firstName")}
          />
          {errors.person?.firstName && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.person?.firstName.message}
            </p>
          )}
        </div>
        <div className="col-md-6">
          <label htmlFor="lastName" className="control-label required">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            {...register("person.lastName")}
          />
          {errors.person?.lastName && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.person.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="row mb-2">
        <div className="col-md-6">
          <label htmlFor="email" className="control-label required">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            {...register("person.email")}
          />
          {errors.person?.email && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.person.email.message}
            </p>
          )}
        </div>
        <div className="col-md-6">
          <label htmlFor="phoneNumber" className="control-label required">
            Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            id="phoneNumber"
            {...register("person.phoneNumber")}
          />
          {errors.person?.phoneNumber && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.person.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="row mb-2">
        <div className="col-md-12">
          <label htmlFor="address" className="control-label required">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            {...register("person.address")}
          />
          {errors.person?.address && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.person.address.message}
            </p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="role" className="control-label required">
            Date of Birth
          </label>
          <input
            type="date"
            className="form-control"
            id="dateOfBirth"
            {...register("dateOfBirth")}
          />
          {errors.dateOfBirth && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
