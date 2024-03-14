import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const contact = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { versionKey: null }
);
contact.post("save", handleSaveError);
contact.pre("findOneAndUpdate", setUpdateSettings);
contact.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contact);

export default Contact;
