/**
 * @author aidan@nebulaconsulting.co.uk
 * @date 08/12/2021
 * @description Maps value in Flow via a Lookup Table. The table is supplied as Request.keyValuePairsString. The value
 * to map is Request.thisKey. It is assumed that Request.keyValuePairsString is fixed across all bulkified values
 */

public inherited sharing class FlowMap {

    @InvocableMethod(Label='Map a Value' ConfigurationEditor='c-flow-map-editor')
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

        @SuppressWarnings('PMD.EmptyStatementBlock') // Default constructor is required to be used in Flow
        public Request() {
        }

        public Request(String thisKey, String keyValuePairsString) {
            this.thisKey = thisKey;
            this.keyValuePairsString = keyValuePairsString;
        }
    }

    public class KeyValue {

        @InvocableVariable
        public String key;

        @InvocableVariable
        public String value;

        @SuppressWarnings('PMD.EmptyStatementBlock') // Default constructor is required to be used in Flow
        public KeyValue() {
        }

        public KeyValue(String key, String value) {
            this.key = key;
            this.value = value;
        }
    }
}