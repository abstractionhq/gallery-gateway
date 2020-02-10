import { expect } from "chai";

import { createScholarship } from "../../resolvers/mutations/scholarship";
import { ADMIN, STUDENT, JUDGE } from "../../constants";
import Scholarship from "../../models/scholarship";

const newScholarship = {
  name: "Mr. Murray Scholarship for the Double Jointed",
  gpa: 2.0,
  yearStatus: 3,
  requiredPhotos: 20,
  description:
    "This scholarship helps student's finances be as flexible as their elbows.",
  fulltime: true,
  renewable: true,
  requiresEssay: true,
  degreePrograms: "MBA"
};

describe("Scholarship Resolvers", () => {
  describe("Scholarship Mutators", () => {
    describe("createScholarship", () => {
      it("does not let students create scholarships", () => {
        return expect(() =>
          createScholarship(
            "",
            { input: newScholarship },
            { auth: { type: STUDENT } }
          )
        ).to.throw(/Permission Denied/);
      });
      it("does not let judges create scholarships", () => {
        return expect(() =>
          createScholarship(
            "",
            { input: newScholarship },
            { auth: { type: JUDGE } }
          )
        ).to.throw(/Permission Denied/);
      });
      it("lets admins creates new scholarships", () => {
        return createScholarship(
          "",
          { input: newScholarship },
          {
            auth: { type: ADMIN }
          }
        ).then(() => {
          Scholarship.count().then(num => expect(num).to.equal(1));
        });
      });
    });
  });
});
