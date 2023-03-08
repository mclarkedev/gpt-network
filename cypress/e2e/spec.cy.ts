const app = "http://localhost:3000";

function openDieterRamsSession() {
  cy.visit("/");
  cy.get(`[data-test-id="SearchButton"]`).then((el) => {
    Cypress.dom.isVisible(el);
  });

  cy.get(`[data-test-id="SearchButton"]`).trigger("click");
  cy.get(`[data-test-id="CommandModal"]`).then((el) => {
    Cypress.dom.isVisible(el);
  });

  cy.get(`[data-test-id="SearchInput-input"]`).then((el) => {
    Cypress.dom.isVisible(el);
  });

  cy.intercept("http://localhost:3000/api/openai/completion").as(
    "getCompletion"
  );

  cy.get(`[data-test-id="SearchInput-input"]`).type("Dieter Rams{enter}");

  cy.get(`[data-test-id="LoadingIcon"]`).then((el) => {
    Cypress.dom.isVisible(el);
  });

  cy.wait("@getCompletion");
}

describe("Index/Start", () => {
  it("renders an interactive search command modal that completes completion requests", () => {
    openDieterRamsSession();
  });
});

describe("Index/InteractiveForceGraph/NodesPane", () => {
  before(() => {
    openDieterRamsSession();
  });

  it("renders hoverable items", () => {
    cy.get(`[data-test-id="NodesPane"]`).then((el) => {
      Cypress.dom.isVisible(el);
    });

    cy.get(`[data-test-id="NodesPane-item-0"]`).then((el) => {
      Cypress.dom.isVisible(el);
    });

    cy.get(`[data-test-id="NodesPane-item-0"]`).trigger("mouseover");

    cy.get(`[data-test-id="NodesPane-item-0"]`).should(
      "have.class",
      "text-white"
    );

    cy.get(`[data-test-id="NodesPane"]`).trigger("mouseout");

    cy.get(`[data-test-id="NodesPane-item-0"]`).should(
      "have.class",
      "text-neutral-400"
    );
  });
});

export {};
