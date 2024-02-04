import { USERS } from "../../constants/constants";

type PasswordData = {
  password: string;
};

type PasswordDataProps = PasswordData & {
  updateFields: (fields: Partial<PasswordData>) => void;
};

export function PasswordForm({ password, updateFields }: PasswordDataProps) {
  return (
    <>
      <label htmlFor="password" className="form-group">
        Password - ({password.length}/{USERS.PASSWORD_MAX})
      </label>
      <input
        id="password"
        type="password"
        minLength={USERS.PASSWORD_MIN}
        maxLength={USERS.PASSWORD_MAX}
        className="form-control mb-2"
        required={true}
        value={password}
        onChange={(e) => updateFields({ password: e.target.value })}
      />
    </>
  );
}
