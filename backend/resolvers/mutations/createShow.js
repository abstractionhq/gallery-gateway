import Show from '../../models/show'

export default {
    createShow: (_, args) => {
        return Show.create(args.input);
    }
};