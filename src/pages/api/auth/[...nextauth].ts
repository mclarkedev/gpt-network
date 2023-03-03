import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
  console.log(process.env);
  throw new Error("Missing Environment Variables GOOGLE_ID and GOOGLE_SECRET");
}

export default NextAuth({
  secret: process.env.SECRET,
  theme: {
    brandColor: "black",
    colorScheme: "auto",
  },
  providers: [
    // OAuth authentication providers
    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Sign in with passwordless email link
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: "<no-reply@example.com>",
    // }),
  ],
});
