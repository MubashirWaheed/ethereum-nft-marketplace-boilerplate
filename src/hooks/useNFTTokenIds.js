import { ContactsOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useNFTTokenIds = (addr) => {
  const { token } = useMoralisWeb3Api();
  const { chainId } = useMoralisDapp();
  const { resolveLink } = useIPFS();
  const [NFTTokenIds, setNFTTokenIds] = useState([]);
  const [totalNFTs, setTotalNFTs] = useState();
  const [fetchSuccess, setFetchSuccess] = useState(true);
  const [cursor, setCursor] = useState()
  const [page, setPage] = useState(1)
  const {
    fetch: getNFTTokenIds,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(token.getAllTokenIds, {
    chain: chainId,
    address: addr,
    cursor:cursor,
    limit: 100,
  });
  useEffect(()=>{
    async function getData() {
      if (data?.result) {
        console.log('data from hook',data)
        const NFTs = data.result;
        setTotalNFTs(data.total);
        setFetchSuccess(true);
        for (let NFT of NFTs) {
          if (NFT?.metadata) {
            NFT.metadata = JSON.parse(NFT.metadata);
            NFT.image = resolveLink(NFT.metadata?.image);
          } else if (NFT?.token_uri) {
            try {
              await fetch(NFT.token_uri)
                .then((response) => response.json())
                .then((data) => {
                  NFT.image = resolveLink(data.image);
                });
            } catch (error) {
              setFetchSuccess(false);         
            }
          }
        }
        setNFTTokenIds(NFTs);
      }
    }
    getData();
  }, [data]);

  // useEffect(async () => {
  //   if (data?.result) {
  //     const NFTs = data.result;
  //     setTotalNFTs(data.total);
  //     setFetchSuccess(true);
  //     for (let NFT of NFTs) {
  //       if (NFT?.metadata) {
  //         NFT.metadata = JSON.parse(NFT.metadata);
  //         NFT.image = resolveLink(NFT.metadata?.image);
  //       } else if (NFT?.token_uri) {
  //         try {
  //           await fetch(NFT.token_uri)
  //             .then((response) => response.json())
  //             .then((data) => {
  //               NFT.image = resolveLink(data.image);
  //             });
  //         } catch (error) {
  //           setFetchSuccess(false);
              
  //         }
  //       }
  //     }
  //     setNFTTokenIds(NFTs);
  //   }
  // }, [data]);

  return {
    getNFTTokenIds,
    NFTTokenIds,
    totalNFTs,
    fetchSuccess,
    error,
    isLoading,
    setCursor,
    data,
    setPage, 
    page
  };
};
