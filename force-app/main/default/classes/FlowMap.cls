/**
 * @author aidan@nebulaconsulting.co.uk
 * @date 08/12/2021
 * @description (if required)
 */

public with sharing class FlowMap {

    @InvocableMethod(Label='Map a value' ConfigurationEditor='c-flow-map-editor')
    public static List<String> get(List<Request> requests) {
        List<String> results = new List<String>();

        return  results;
    }


    public class Request {
        @InvocableVariable
        public String thisKey;
        @InvocableVariable
        public String keyValuePairsString; // Serialised List<KeyValue>
    }

    public class KeyValue {
        @InvocableVariable
        public String key;
        @InvocableVariable
        public String value;
    }
}