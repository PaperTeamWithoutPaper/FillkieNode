/**
 * GoogleDriveException
 */
export default class GoogleDriveException {
    type = 'GoogleDriveException';
    message!: string;

    /**
     * Constructor
     * @param {string} message message
     */
    constructor(message: string) {
        this.message = message;
    }
}
