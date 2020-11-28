import CommonService from "../services"
import toastr from 'toastr';

// all common functions will come here

/**
 * Common Notes Delete function which would be used for delete as well as Delete Forever
 * @param {Object} body 
 * @param {String} url 
 */
export async function deleteNoteCommonFn(body, url) {
    try {
        let req = {
            "method": "POST",
            "url": url,
            "body": body
        }
        let resp = await CommonService(req);
        if (resp) {
            return resp;
        } else {
            toastr.error("Error");
            return
        }
    } catch (error) {
        console.error(error);
    }

}


/**
 * Common Save Function used for Save as well as Make a Copy feature
 * @param {Object} body 
 * @param {String} url 
 */

export async function saveNotesCommonFunction(body, url) {
    try {
        let req = {
            "method": "POST",
            "url": url,
            "body": body
        }
        let resp = await CommonService(req);
        if (resp) {
            return resp;
        } else {
            toastr.error("Error");
            return
        }
    } catch (error) {
        console.error(error)
    }

}

/**
 * Common function for Archiving and Unarchiving based on the value passed
 * @param {Object} body 
 * @param {String} url 
 */
export async function archiveCommonFunction(body, url) {
    try {
        let req = {
            "method": "POST",
            "url": url,
            "body": body
        }
        let resp = await CommonService(req);
        if (resp) {
            return resp;
        } else {
            toastr.error("Error");
            return
        }
    } catch (error) {
        console.error(error)
    }
}