/**
 * @author aidan@nebulaconsulting.co.uk
 * @date 08/12/2021
 */

import { LightningElement, api } from 'lwc';

export default class FlowMapEditor extends LightningElement {

    columns = [
        { label: 'Key', fieldName: 'key', editable: true, sortable: true  },
        { label: 'Value', fieldName: 'value', editable: true, sortable: true },
        {
            type: 'action',
            typeAttributes: { rowActions: [
                    { label: 'Delete', name: 'delete' }
                ] },
        }
    ];
    draftValues = [];
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;
    errorMessage;

    @api
    inputVariables;

    @api validate() {
        const validity = [];
        this.errorMessage = null;

        this.keyValuePairs.forEach(thisKeyValuePair => {
            if(thisKeyValuePair.key == null || thisKeyValuePair.key === "") {
                this.errorMessage = 'A key is required for every mapping row. You may delete rows using the action button.';
                validity.push({
                    key: 'keyValuePairsString',
                    errorString: this.errorMessage,
                });

            }
        })
        return validity;
    }

    get thisKey() {
        const param = this.inputVariables.find(({ name }) => name === 'thisKey');
        return param && param.value;
    }

    get keyValuePairs() {
        const param = this.inputVariables.find(({ name }) => name === 'keyValuePairsString');
        const result = param != null ? JSON.parse(param.value) : [];
        result.forEach((thisKeyValuePair, index) => thisKeyValuePair.id = index.toString());
        return result;
    }

    handleTableSave(event) {
        const newKeyValuePairs = this.keyValuePairs;
        for (let i = 0; i < event.detail.draftValues.length; i++) {
            const thisDraftValue = event.detail.draftValues[i];
            const matchIndex = newKeyValuePairs.findIndex(thisKeyValuePair => thisKeyValuePair.id === thisDraftValue.id);
            if(matchIndex >= 0) {
                Object.assign(newKeyValuePairs[matchIndex], thisDraftValue);
            }
        }
        this.draftValues = [];
        this.handleKeyValuePairsChange(newKeyValuePairs);
        if(this.errorMessage) {
            this.validate();
        }
    }

    handleThisKeyChange(event) {
        this.handleChange(event, 'thisKey');
    }

    handleKeyValuePairsChange(newKeyValuePairs) {
        this.handleChange({detail : { value: JSON.stringify(newKeyValuePairs)} }, 'keyValuePairsString');
    }

    handleChange(event, name) {
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
                        newValueDataType: 'String'
                    },
                }
            );
            this.dispatchEvent(valueChangedEvent);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            default:
        }
    }

    deleteRow(row) {
        let newKeyValuePairs = this.keyValuePairs;
        const index = newKeyValuePairs.findIndex(thisKeyValuePair => thisKeyValuePair.id === row.id);
        if (index >= 0) {
            newKeyValuePairs = newKeyValuePairs
                .slice(0, index)
                .concat(newKeyValuePairs.slice(index + 1));
            this.handleKeyValuePairsChange(newKeyValuePairs);
        }
    }

    addKeyValuePair() {
        this.handleKeyValuePairsChange([...this.keyValuePairs, {key: '', value: ''}]);
    }

    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                return primer(x[field]);
            }
            : function (x) {
                return x[field];
            };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    handleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const newKeyValuePairs = this.keyValuePairs;

        newKeyValuePairs.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? -1 : 1));
        this.handleKeyValuePairsChange(newKeyValuePairs);
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}