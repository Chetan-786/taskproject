// This class would be used just for refresh purposes to call apilinks
import React, { Component } from "react";
import CommonService from "./services";
import constants from './constants';
import toastr from "toastr";
class CommonFile extends Component {

    constructor(props) {
        super(props);
        this.onLoadFunction = this.onLoadFunction.bind(this);
    }

    componentDidMount() {
        if (!localStorage.getItem(constants.LocalStorageGetAllApi)) {
            this.onLoadFunction();
        } else {
            // this.props.history.push('/login')
        }
    }

    /**
     * This fn will be used to call getallapi if its not present in storage
     */
    async onLoadFunction() {
        try {
            let req = {
                "url": constants.APIURL,
                "method": "GET"
            }
            let resp = await CommonService(req);
            if (resp && resp.isSuccess) {
                toastr.success(resp.message);

                let obj = {};
                resp.data.forEach(element => {
                    obj[element.apiname] = element.apilink;
                });
                localStorage.setItem(constants.LocalStorageGetAllApi, JSON.stringify(obj))
            } else {
                toastr.error(resp.message);
            }
        } catch (err) {
            console.error(err)
        }
    }

    render() {

        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
}

export default CommonFile;