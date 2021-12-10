# "Map a Value" for Flow

Maps are a familiar data structure for Apex developers, but they also offer benefits in Flow. They can replace 
many-branched decision nodes with a single node.

This scenario occurs in many places. For example, sending an email where the template to use is based on the value of a
picklist field. Or creating a Case from a trigger where the Record Type of the Case depends on a field from the trigger.

## A simple example: Account Record Type from Type

To demonstrate, we use a toy example of setting an Account's Record Type based on the Type 
(a standard picklist field on Account).

### Using a decision node

First, a conventional approach with a decision node:

![Branching Flow](images/branching_flow.png)

As you would expect, this Flow checks `Type` in a decision node and assigns to a variable with the corresponding 
Account Record Type Developer Name. It then queries for the Record Type Id and assigns that onto the Account.

### Using a map node

That's fine, but it could be simplified with a Map:

![Map Flow](images/map_flow.png)

In this version, the mapping from `Type` to the Record Type Developer Name is a single step. That's great, let's take 
a look at the configuration of that magic node:

![Map Flow Configuration](images/map_flow_config.png)

The configuration needs two things:

* The name of the input variable
* A table of mapping data