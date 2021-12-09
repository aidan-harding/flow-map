/**
 * @author aidan@nebulaconsulting.co.uk
 * @date 08/12/2021
 * @description (if required)
 */

public with sharing class FlowMap {

    @InvocableMethod(Label='Map a value' ConfigurationEditor='c-flow-map-editor')
    public static List<String> get(List<Request> requests) {
        List<String> results = new List<String>();
        Map<String, String> theMapping = getMapping(requests[0]);
        for(Request thisRequest : requests) {
            results.add(theMapping.get(thisRequest.thisKey));
        }
        return  results;
    }

    private static Map<String, String> getMapping(Request firstRequest) {
        Map<String, String> result = new Map<String, String>();
        List<KeyValue> keyValues = (List<KeyValue>)JSON.deserialize(firstRequest.keyValuePairsString, List<KeyValue>.class);
        for(KeyValue thisKeyValue : keyValues) {
            result.put(thisKeyValue.key, thisKeyValue.value);
        }
        return result;
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