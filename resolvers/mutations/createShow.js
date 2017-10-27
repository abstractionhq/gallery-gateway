import Show from '../../models/show'

export default {
    createShow: (_, args) => {
        console.log(args)
        return Show.create(args.input);
    }
};