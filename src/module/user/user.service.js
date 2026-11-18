import { User } from "../../DB/model/index.js";

const fail = (message, status) => new Error(message, { cause: { status } });

// POST /users/signup  (build + save)
export async function signup(data = {}) {
  const { name, email, password, role } = data;

  const exists = await User.findOne({ where: { email } });
  if (exists) throw fail("Email already exists.", 409);

  try {
    const user = User.build({ name, email, password, role });
    await user.save();
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      throw fail(error.errors.map((e) => e.message).join(", "), 400);
    }
    throw error;
  }
  return { message: "User added successfully." };
}

// PUT /users/:id  (create or update by PK, skip validation)
export async function createOrUpdateUser(id, data = {}) {
  await User.upsert({ ...data, id }, { validate: false });
  return { message: "User created or updated successfully" };
}

// GET /users/by-email?email=
export async function getUserByEmail(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw fail("no user found", 404);
  return { user };
}

// GET /users/:id  (without role)
export async function getUserById(id) {
  const user = await User.findByPk(id, { attributes: { exclude: ["role"] } });
  if (!user) throw fail("no user found", 404);
  return user;
}
