import { RandomEnum } from "../enums/random.enum";

export function randomCharacters(
  option: "NUMBER" | "LETTER" | "COMBINED",
  lengthPass = 6
) {
  let pwdChars: string = "";
  switch (option) {
    case "NUMBER":
      pwdChars = RandomEnum.NUMBER;
      break;
    case "LETTER":
      pwdChars = RandomEnum.LETTER;
      break;
    case "COMBINED":
      pwdChars = RandomEnum.COMBINED;
      break;
  }
  const pwdLen = lengthPass;
  const randPassword = Array(pwdLen)
    .fill(pwdChars)
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join("");
  return randPassword;
}

export function generateRandomPassword(
  length: number,
  useMayus: boolean,
  useNumber: boolean,
  useSpecial: boolean
) {
  let caracteres = RandomEnum.MINUS as string;
  let password = "";

  if (useMayus) caracteres += RandomEnum.MAYUS;
  if (useNumber) caracteres += RandomEnum.NUMBER;
  if (useSpecial) caracteres += RandomEnum.SPECIAL;

  const indexMayus = Math.floor(Math.random() * RandomEnum.MAYUS.length);
  const indexNumber = Math.floor(Math.random() * RandomEnum.NUMBER.length);
  const indexSpecial = Math.floor(Math.random() * RandomEnum.SPECIAL.length);

  password += RandomEnum.MAYUS.charAt(indexMayus);
  password += RandomEnum.NUMBER.charAt(indexNumber);
  password += RandomEnum.SPECIAL.charAt(indexSpecial);

  for (let i = 0; i < length - 3; i++) {
    const index = Math.floor(Math.random() * caracteres.length);
    password += caracteres.charAt(index);
  }

  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}
