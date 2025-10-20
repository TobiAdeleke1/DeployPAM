import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Chip,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Collapse,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    LocationOn,
    Restaurant,
    LocalCafe,
    LocalGasStation,
    LocalHospital,
    School,
    ShoppingCart,
    Directions,
    ExpandMore,
    ExpandLess,
    Phone,
    Email,
    Web,
    AccessTime,
    Star,
    Map
} from '@mui/icons-material';
import { useLocationAppData } from '../contexts/LocationContext';

const amenityIcons = {
    restaurant: <Restaurant />,
    cafe: <LocalCafe />,
    fuel: <LocalGasStation />,
    hospital: <LocalHospital />,
    school: <School />,
    shop: <ShoppingCart />,
    pharmacy: <LocalHospital />,
    bank: <ShoppingCart />,
    atm: <ShoppingCart />,
    post_office: <ShoppingCart />,
    police: <LocalHospital />,
    fire_station: <LocalHospital />,
    default: <LocationOn />
};

const amenityColors = {
    restaurant: 'primary',
    cafe: 'secondary',
    fuel: 'warning',
    hospital: 'error',
    school: 'info',
    shop: 'success',
    pharmacy: 'error',
    bank: 'success',
    atm: 'success',
    post_office: 'info',
    police: 'error',
    fire_station: 'error',
    default: 'default'
};

export default function LocationDetail({ onCenter, onClose }) {
    const { locationApp, locationAppData } = useLocationAppData();
    const [expandedSections, setExpandedSections] = useState({
        restaurants: true,
        cafes: true,
        services: true,
        healthcare: true,
        education: true,
        shopping: true,
        other: false
    });

    const isLoading = !locationApp;

    const handleSectionToggle = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const categorizeAmenities = () => {
        if (!locationAppData.amenity_nodes) return {};

        const categories = {
            restaurants: [],
            cafes: [],
            services: [],
            healthcare: [],
            education: [],
            shopping: [],
            other: []
        };

        locationAppData.amenity_nodes.forEach(amenity => {
            const amenityType = amenity?.tags?.amenity;
            
            switch (amenityType) {
                case 'restaurant':
                    categories.restaurants.push(amenity);
                    break;
                case 'cafe':
                    categories.cafes.push(amenity);
                    break;
                case 'fuel':
                case 'bank':
                case 'atm':
                case 'post_office':
                case 'police':
                case 'fire_station':
                    categories.services.push(amenity);
                    break;
                case 'hospital':
                case 'pharmacy':
                case 'clinic':
                    categories.healthcare.push(amenity);
                    break;
                case 'school':
                case 'university':
                case 'college':
                    categories.education.push(amenity);
                    break;
                case 'shop':
                case 'supermarket':
                case 'convenience':
                    categories.shopping.push(amenity);
                    break;
                default:
                    if (amenityType) {
                        categories.other.push(amenity);
                    }
            }
        });

        return categories;
    };

    const renderAmenityList = (amenities, category) => {
        if (!amenities.length) {
            return (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No {category} found nearby
                </Typography>
            );
        }

        return (
            <List dense>
                {amenities.slice(0, 10).map((amenity, index) => {
                    const name = amenity?.tags?.name || amenity?.tags?.amenity || 'Unnamed';
                    const amenityType = amenity?.tags?.amenity;
                    const cuisine = amenity?.tags?.cuisine;
                    const lat = parseFloat(amenity?.lat);
                    const lon = parseFloat(amenity?.lon);
                    const distance = amenity?.distance;

                    return (
                        <ListItem key={amenity.id || index} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                {amenityIcons[amenityType] || amenityIcons.default}
                            </ListItemIcon>
                            <ListItemText
                                primary={name}
                                secondary={
                                    <Box>
                                        {amenityType && (
                                            <Chip
                                                label={amenityType}
                                                size="small"
                                                color={amenityColors[amenityType] || 'default'}
                                                sx={{ mr: 1, mb: 0.5 }}
                                            />
                                        )}
                                        {cuisine && (
                                            <Chip
                                                label={cuisine}
                                                size="small"
                                                variant="outlined"
                                                sx={{ mr: 1, mb: 0.5 }}
                                            />
                                        )}
                                        {distance && (
                                            <Typography variant="caption" color="text.secondary">
                                                {distance.toFixed(1)}m away
                                            </Typography>
                                        )}
                                    </Box>
                                }
                            />
                            {Number.isFinite(lat) && Number.isFinite(lon) && (
                                <IconButton
                                    size="small"
                                    onClick={() => onCenter?.([lat, lon], { title: name, amenity: amenityType })}
                                    title="Show on map"
                                >
                                    <Map fontSize="small" />
                                </IconButton>
                            )}
                        </ListItem>
                    );
                })}
                {amenities.length > 10 && (
                    <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>
                        ... and {amenities.length - 10} more
                    </Typography>
                )}
            </List>
        );
    };

    const renderSection = (title, amenities, category, icon) => (
        <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: 0 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleSectionToggle(category)}
                >
                    {icon}
                    <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                        {title} ({amenities.length})
                    </Typography>
                    {expandedSections[category] ? <ExpandLess /> : <ExpandMore />}
                </Box>
                <Divider />
                <Collapse in={expandedSections[category]}>
                    <Box sx={{ p: 2 }}>
                        {renderAmenityList(amenities, category)}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!locationApp?.id) {
        return (
            <Alert severity="info" sx={{ m: 2 }}>
                No location selected. Please select a location to view details.
            </Alert>
        );
    }

    const amenities = categorizeAmenities();
    const locationName = locationApp.properties?.name || 'Selected Location';
    const address = locationApp.properties?.display_name || 'Address not available';
    const coordinates = locationApp.geometry?.coordinates;

    return (
        <Box sx={{ p: 2, maxHeight: '100vh', overflow: 'auto' }}>
            {/* Location Header */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography variant="h4" gutterBottom>
                    {locationName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {address}
                </Typography>
                {coordinates && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" />
                        <Typography variant="body2">
                            {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Quick Actions */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Directions />}
                        onClick={() => onCenter?.(coordinates, { title: locationName })}
                    >
                        Center Map
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Map />}
                        onClick={onClose}
                    >
                        Close Details
                    </Button>
                </Grid>
            </Grid>

            {/* Amenities Sections */}
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Nearby Amenities
            </Typography>

            {renderSection(
                'Restaurants',
                amenities.restaurants,
                'restaurants',
                <Restaurant color="primary" />
            )}

            {renderSection(
                'Cafes',
                amenities.cafes,
                'cafes',
                <LocalCafe color="secondary" />
            )}

            {renderSection(
                'Services',
                amenities.services,
                'services',
                <LocalGasStation color="warning" />
            )}

            {renderSection(
                'Healthcare',
                amenities.healthcare,
                'healthcare',
                <LocalHospital color="error" />
            )}

            {renderSection(
                'Education',
                amenities.education,
                'education',
                <School color="info" />
            )}

            {renderSection(
                'Shopping',
                amenities.shopping,
                'shopping',
                <ShoppingCart color="success" />
            )}

            {renderSection(
                'Other Amenities',
                amenities.other,
                'other',
                <LocationOn color="default" />
            )}

            {/* Summary Stats */}
            <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Location Summary
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Total Amenities
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {Object.values(amenities).reduce((sum, arr) => sum + arr.length, 0)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Categories
                            </Typography>
                            <Typography variant="h4" color="secondary">
                                {Object.values(amenities).filter(arr => arr.length > 0).length}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}
