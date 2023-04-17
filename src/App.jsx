import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  Text,
  Link,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useProvider, useAccount } from "wagmi";
import { ethers } from 'ethers';

const config = {
  apiKey: 'L20Lg9Vo9MOII6N008-KOtnVIh9uKzQE',
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

function App() {
  const provider = useProvider();
  const { address, isConnected, isDisconnected } = useAccount()
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);

  useEffect(()=>{
    if(isDisconnected){
      document.getElementById('wallet-address').value = ''
      setUserAddress('');
      
    } else if(isConnected){
      document.getElementById('wallet-address').value = address
      setUserAddress(address);
    }
  }, [address, isDisconnected, isConnected])

  useEffect(()=>{
    async function resolveAddress(addressToResolve){
      let isValidAddress = ethers.utils.isAddress(userAddress);
      let ensAddress;
      if(!isValidAddress){
        try { ensAddress = await alchemy.core.resolveName(addressToResolve); }
        catch(e){}
      }
      
      if(isValidAddress || ensAddress != undefined)
        document.getElementById('check-balance').disabled = false
      else  
        document.getElementById('check-balance').disabled = true
    }
    resolveAddress(userAddress)
  }, [userAddress])

  
  async function getTokenBalance() {
    setHasQueried(true);
    setIsReady(false);
    
    let data;
    try{
      data = await alchemy.core.getTokenBalances(userAddress);
    } catch(e){
      console.log(e);
      console.log("Something went wrong, try again later")
      setHasQueried(false);
      setIsReady(false);
      return
    }
    // const data = await alchemy.core.getTokenBalances(userAddress);

    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      try{
        const tokenData = alchemy.core.getTokenMetadata(
          data.tokenBalances[i].contractAddress
        );
        tokenDataPromises.push(tokenData);
      } catch(e){
        console.log(e);
        console.log("Something went wrong, try again later")
        setHasQueried(false);
        setIsReady(false);
        return
      }
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(false);
    setIsReady(true);
  }

  function parseBalance(tokenBalance, decimals){
    let balanceString = Utils.formatUnits(
      tokenBalance,
      decimals
    )
    if(parseFloat(balanceString).toFixed(4) == 0)
      return 0
    return  parseFloat(balanceString).toFixed(4)
    

  }


  return (
    <>
    <Box className='wallet-connect'>
      <ConnectButton />
    </Box>
    <Box w="100vw">
      <Center>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading textAlign='center' mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text textAlign='center'>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading textAlign='center' mt={10}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Input
          id='wallet-address'
          mt={5}
          onChange={(e) => setUserAddress(e.target.value)}
          color="black"
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
          defaultValue={userAddress}
        />
        <Button fontSize={20} onClick={getTokenBalance} mt={5} id='check-balance' isLoading={hasQueried} >
          Check ERC-20 Token Balances
        </Button>

        <Heading textAlign='center' my={10}>ERC-20 token balances:</Heading>
      </Flex>
    </Box>
    {isReady ? (
      <Center>
        <Box >
        <TableContainer>
            <Table size='md' variant='striped'>
              <Thead>
                <Tr >
                  <Th textAlign='center'>Symbol</Th>
                  <Th textAlign='center'>Balance</Th>
                  <Th textAlign='center'>Address</Th>
                </Tr>
              </Thead>
              <Tbody>
              {results.tokenBalances.map((e, i) => {
                return (

                <Tr key={e.contractAddress}>
                  <Td >
                    <Box display='flex' alignItems={'center'} justifyContent={'center'} >
                    {tokenDataObjects[i].logo ? (
                    <Image 
                      borderRadius='full'
                      boxSize='25px'
                      m={2}
                      // objectFit='cover' 
                      src={tokenDataObjects[i].logo}  />
                    ) : null } {tokenDataObjects[i].symbol}</Box></Td>
                  <Td>{ parseBalance(e.tokenBalance, tokenDataObjects[i].decimals) }</Td>
                  <Td>
                    <Link href={'https://etherscan.io/token/'+e.contractAddress+'?a='+userAddress} isExternal >
                      {e.contractAddress} <ExternalLinkIcon mx='2px' />
                    </Link>
                  </Td>
                </Tr>)}
                )}


              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Center>
    ) : (hasQueried && !isReady) ? (
        <Center>
          {/* <Spinner 
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            // size='xl'
            w="60px"
            h="60px"
          /> */}
          Just wait a bit more ...
        </Center>
        
    ) : (
      <Center>
        Input a valid address or ENS name and click the button above!
      </Center>
    )} 
  </>
  );
}

export default App;
