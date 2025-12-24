export default function UserInfo({ name, email }) {
  return (
    <div>
      <h2 className="profile-name">{name}</h2>
      <p className="profile-email">{email}</p>
    </div>
  );
}
