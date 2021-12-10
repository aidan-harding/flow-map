/**
 * @author aidan@nebulaconsulting.co.uk
 * @date 10/12/2021
 */

@IsTest
private class FlowMapTest {

    @IsTest
    static void testBehavior() {
        List<FlowMap.KeyValue> mapping = new List<FlowMap.KeyValue> {
                new FlowMap.KeyValue('foo', 'bar')
        };

        List<String> results = FlowMap.get(new List<FlowMap.Request>{
                new FlowMap.Request('foo', JSON.serialize(mapping)),
                new FlowMap.Request('baz', null)
        });

        System.assertEquals('bar', results[0]);
        System.assertEquals(null, results[1]);
        System.assertNotEquals(null, new FlowMap.Request());
        System.assertNotEquals(null, new FlowMap.KeyValue());
    }
}