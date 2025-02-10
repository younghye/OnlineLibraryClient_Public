import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TEmployee } from "schema/person";
import { EnumEmployeeRole } from "schema/enums";
import { useEmployeeStore } from "hooks/store/useEmployeeStore";

interface Props {
  errors: FieldErrors<TEmployee>;
  register: UseFormRegister<TEmployee>;
}
export default function EmployeeInputForm({ errors, register }: Props) {
  const { showUpdate } = useEmployeeStore();
  return (
    <div className="form-group ps-3 pe-3 text-start">
      <div className="row mb-1">
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

      <div className="row mb-1">
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
            type="number"
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

      <div className="row mb-1">
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

      <div className="row mb-1">
        <div className="col-md-6">
          <label htmlFor="role" className="control-label required">
            Role
          </label>
          <select
            className="form-select form-control"
            id="role"
            {...register("role")}
          >
            {Object.keys(EnumEmployeeRole).map((key) => (
              <option key={key} value={(EnumEmployeeRole as any)[key]}>
                {key}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-danger text-start w-100 m-0 text-wrap">
              {errors.role.message}
            </p>
          )}
        </div>
        {!showUpdate && (
          <div className="col-md-6">
            <label htmlFor="userName" className="control-label required">
              User Name
            </label>
            <input
              type="text"
              className="form-control"
              id="userName"
              {...register("userName")}
            />
            {errors.userName && (
              <p className="text-danger text-start w-100 m-0 text-wrap">
                {errors.userName.message}
              </p>
            )}
          </div>
        )}
      </div>

      {!showUpdate && (
        <div className="row mb-1">
          <div className="col-md-6">
            <label htmlFor="password" className="control-label required">
              Password
            </label>
            <input
              type="text"
              className="form-control"
              id="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-danger text-start w-100 m-0 text-wrap">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="confirmPassword" className="control-label required">
              Confirm Password
            </label>
            <input
              type="text"
              className="form-control"
              id="confirmPassword"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-danger text-start w-100 m-0 text-wrap">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
