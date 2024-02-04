import { USERS } from "../../constants/constants";

type EmailData = {
  email: string;
};

type EmailDataProps = EmailData & {
  updateFields: (fields: Partial<EmailData>) => void;
};

export function EmailForm({ email, updateFields }: EmailDataProps) {
  return (
    <>
      <label htmlFor="email" className="form-group">
        Email - ({email.length}/{USERS.EMAIL})
      </label>
      <input
        id="email"
        type="email"
        maxLength={USERS.EMAIL}
        className="form-control mb-2 signup-input"
        required={true}
        value={email}
        onChange={(e) => updateFields({ email: e.target.value })}
      />
    </>
  );
}
