import emailjs from "emailjs-com";
import env from "./env";

export const sendAnEmail = (
  email: string,
  commitId?: string,
  endsAt?: string
): void => {
  const templateParams = {
    email,
    commitId,
    endsAt,
  };

  const { emailJsServiceId, emailJsTemplateId, emailJsPublicKey } = env;

  emailjs.send(
    emailJsServiceId,
    emailJsTemplateId,
    templateParams,
    emailJsPublicKey
  );
};
