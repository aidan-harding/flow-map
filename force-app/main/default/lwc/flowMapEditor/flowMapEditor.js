/**
 * @author aidan@nebulaconsulting.co.uk
 * @date 08/12/2021
 */

import { LightningElement, api } from 'lwc';

export default class FlowMapEditor extends LightningElement {

    @api
    inputVariables;

    @api validate() {
        const validity = [];
        // if (!this.keyValue) {
        //     validity.push({
        //         key: 'keyValue',
        //         errorString: 'Key Value is required.',
        //     });
        // }
        return validity;
    }

    get thisKey() {
        const param = this.inputVariables.find(({ name }) => name === 'thisKey');
        return param && param.value;
    }

    get keyValuePairs() {
        const param = this.inputVariables.find(({ name }) => name === 'keyValuePairs');
        return param != null ? param.value : [];
//        return param && JSON.parse(param.value);
    }

    handleThisKeyChange(event) {
        this.handleChange(event, 'thisKey', 'String');
    }

    handleKeyValuePairsChange(event) {
        this.handleChange(event, 'keyValuePairs', 'List');
    }

    handleKeyValueInputChange(event) {
        const newKeyValuePairs = this.keyValuePairs.map(thisKeyValuePair => Object.assign({}, thisKeyValuePair));
        newKeyValuePairs[event.target.dataset.index][event.target.name] = event.detail.value;

        this.handleKeyValuePairsChange({detail : { value: newKeyValuePairs} });
    }

    handleChange(event, name, newValueDataType) {
        if (event && event.detail) {
            const newValue = event.detail.value;
            const valueChangedEvent = new CustomEvent(
                'configuration_editor_input_value_changed',
                {
                    bubbles: true,
                    cancelable: false,
                    composed: true,
                    detail: {
                        name,
                        newValue,
                        newValueDataType
                    },
                }
            );
            this.dispatchEvent(valueChangedEvent);
        }
    }

    addKeyValuePair() {
        // let keyValuePairs = this.inputVariables.find(({ name }) => name === 'keyValuePairs');
        // const newKeyValuePairs = keyValuePairs != null ? [...keyValuePairs.value, {key: '', value: ''}] : [{key: '', value: ''}];
        const newKeyValuePairs = [...this.keyValuePairs, {key: '', value: ''}];

        this.handleKeyValuePairsChange({detail : { value: newKeyValuePairs} });
        return newKeyValuePairs;
    }
}