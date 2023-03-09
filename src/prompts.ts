// eslint-disable-next-line import/no-anonymous-default-export
export default {
  system: `I always respond with a machine readable "csv".`,
  search: (
    subject: string
  ) => `I am an encyclopedia API that accepts a "subject" and returns a machine readable "csv".

        Let's try it.

        subject: Wade Guyton
        csv: Donald Judd, Whitney Museum of American Art, Postminimalism

        subject: Tauba Auerbach
        csv: John Baldessari, Ellsworth Kelly, Neo-Dada

        subject: Neo-Dada
        csv: Joseph Beuys, Fluxus, Happenings

        subject: Joseph Beuys
        csv: Yves Klein, Nam June Paik, Arte Povera

        subject: Arte Povera
        csv: Jannis Kounellis, Guiseppe Penone, Mario Merz

        subject: ${subject}
        `,
  summarize: (subject: string) => `What is ${subject}, in 1 sentence.`,
};
