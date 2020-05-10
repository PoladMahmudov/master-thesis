# Resource Reliability and Integrity Assurance with Blockchain Technology in Web Browsers

Research is dedicated for development of a human experience-based peer-reviewing security platform. The core idea is to combine web-resource code and code-review results, storing them on the blockchain. Corresponding results from a blockchain inform about possible security risks, when a client downloads an executable code. There are two major advantages of the proposed solution: 1) the original code of a resource is hashed and persisted on a blockchain that assures resource integrity; 2) security reports on code-review are kept on a blockchain that assures resource reliability. The distributed characteristics of blockchain technology advances security of the platform, making it tamper-resistant.

## Getting Started

The project is divided into two parts. Firstly, the smart contracts that pertain to business logic of a platform, playing a backend role and deployed to the blockchain. All information on installation of a blockchain environment, compilation and deployment of smart contracts are provided by [EOSIO platform setup](eosio/README.md).  
Moreover, a frontend is based on a browser extension. It is configured for the EOS blockchain and integrated with the ABI of given smart contracts. Instructions on how to compile and run the browser extension are provided by [Resource Assurer setup](resource-assurer/README.md).  
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a blockchain system, referring to subdirectories of this repository.

### Prerequisites

What things you need to install the software and how to install them

* [Docker](https://www.docker.com/get-started) - Used to setup a blockchain environment
* [EOS Studio](https://www.eosstudio.io/) - A convenient tool, used to start local test node, compile and deploy smart contracts
* [FireFox](https://www.mozilla.org/en-US/firefox/new/) - Browser extension prototype is supported only on given browser


## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/PoladMahmudov/master-thesis/tags). 

## Authors

* **Polad Mahmudov** - *Master thesis researcher*

See also the list of [contributors](https://github.com/PoladMahmudov/master-thesis/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

