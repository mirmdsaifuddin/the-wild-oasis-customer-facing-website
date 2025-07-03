import { auth } from "../_lib/auth";

export const metadata = {
  title: "account",
};
async function page() {
  const session = await auth();
  console.log(session);
  const FirstName = session.user.name.split(" ")[0];
  return <h1>welcome, {FirstName}</h1>;
}

export default page;
