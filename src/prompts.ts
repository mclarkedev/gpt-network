// eslint-disable-next-line import/no-anonymous-default-export
export default {
  system: `I always respond with a machine readable csv body prefixed with the key "csv:". Such as "csv: person 1, person 2, person 3" with all persons names in lowercase.`,
  search: (
    subject: string
  ) => `Given a "subject" return comma separated values of related people in lower case.

        EXPECTED RETURN TYPE:
        "csv: person 1, person 2, person 3"

        subject: ${subject}
        `,
  summarize: (subject: string) => `What is ${subject}, in 1 sentence.`,
};
