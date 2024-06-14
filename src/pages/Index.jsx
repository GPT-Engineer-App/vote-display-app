import React, { useEffect, useState } from "react";
import { Container, Text, VStack, Input, Box, Link, useColorMode, IconButton } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const topStoriesResponse = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
        const topStoryIds = topStoriesResponse.data.slice(0, 5);
        const storyPromises = topStoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const storiesData = await Promise.all(storyPromises);
        setStories(storiesData.map(response => response.data));
        setFilteredStories(storiesData.map(response => response.data));
      } catch (error) {
        console.error("Error fetching top stories:", error);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    setFilteredStories(
      stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, stories]);

  return (
    <Box width="100%" p={[2, 4, 6]} bg={colorMode === "light" ? "gray.50" : "gray.900"}>
      <Container centerContent maxW="container.md" py={4}>
        <Box width="100%" display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="2xl" color={colorMode === "light" ? "black" : "white"}>Top Hacker News Stories</Text>
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
          />
        </Box>
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          mb={4}
          bg={colorMode === "light" ? "white" : "gray.700"}
          color={colorMode === "light" ? "black" : "white"}
        />
        <VStack spacing={4} width="100%">
          {filteredStories.map(story => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%" bg={colorMode === "light" ? "white" : "gray.800"}>
              <Text fontSize="lg" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>
                {story.title}
              </Text>
              <Text color={colorMode === "light" ? "black" : "white"}>Upvotes: {story.score}</Text>
              <Link href={story.url} color="teal.500" isExternal>
                Read more
              </Link>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

export default Index;