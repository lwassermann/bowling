bowling
=======

This is a bowling scoring application. This program and topic is used as a coding challenge for a job application.

The requirements for this were to not use any libraries or frameworks.

Problems with the implementation are documented in the code. They include 
* hasty implementation of data-binding, because of the size of the problem no general solution was needed
* augmenting the array prototype instead of using utility toolbelts such as _ or $. The reason is that it reads a lot better. A LOT better. And in this context we are not restricted because we will not use libraries. And I didn't know about Ramda and their interesting way of implementing it, which might have alleviated my pains.

Cool features are the scrubbing numbers, an idea copied from Bret Victor, and my own testing framework to be sure about the bowling scores, modeled after my knowledge of reading and debugging through the original Smaltalk Unit Tests, the Lively testing framework, and experiences with JCOP.
