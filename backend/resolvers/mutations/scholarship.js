import { UserError } from "graphql-errors"
import { ADMIN } from "../../constants";
import Scholarship from "../../models/scholarship";

export function createScholarship(_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError("Permission Denied");
  }

  const newScholarship = {
      name: args.input.name,
      gpa: args.input.gpa,
      yearStatus: args.input.yearStatus,
      requiredPhotos: args.input.requiredPhotos,
      description: args.input.description,
      fulltime: args.input.fulltime,
      renewable: args.input.renewable,
      requiresEssay: args.input.requiresEssay,
      degreePrograms: args.input.degreePrograms
  }
  return Scholarship.findOne({where:{name: newScholarship.name}}).then((other)=>{
    if(other){
      throw new UserError("Error: A Scholarship with that name already exists.")
    }
    return Scholarship.create(newScholarship)
  })
}
