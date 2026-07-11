function filterByOffice(items, user) {
  if (!user) return items;
  
  return items.filter(item => {
    if (!item.office_tags) return true; // If no tags, visible to all
    try {
      const tags = JSON.parse(item.office_tags);
      if (!Array.isArray(tags) || tags.length === 0) return true;
      
      const normalizedTags = tags.map(t => typeof t === 'string' ? t.toLowerCase() : '');
      if (normalizedTags.includes("state") || normalizedTags.includes("all")) return true;
      
      const userDistrict = user.district ? user.district.toLowerCase() : '';
      const userDept = user.department ? user.department.toLowerCase() : '';
      
      // True if user matches the district tag, OR matches the department tag,
      // OR matches the composite "district_dept" tag.
      // E.g. tag "mandi" -> all mandi sees it
      // tag "police" -> all police sees it
      // tag "mandi_police" -> only mandi police sees it
      
      const isDistrictMatch = userDistrict && normalizedTags.includes(userDistrict);
      const isDeptMatch = userDept && normalizedTags.includes(userDept);
      const isCompositeMatch = userDistrict && userDept && normalizedTags.includes(`${userDistrict}_${userDept}`);
      
      // If the alert ONLY has a composite tag for a different department in the same district, 
      // isDistrictMatch won't be true (because "mandi" isn't in tags, only "mandi_police").
      // So if ANY tag matches user context, it passes.
      
      // However, if the user just selects district = 'mandi', tags = ['mandi'] -> isDistrictMatch = true
      // If user selects district = 'mandi' and target = 'police', tags = ['mandi_police'].
      //   -> A mandi police officer will have isCompositeMatch = true.
      //   -> A mandi SDRF officer will have neither, returns false.
      
      return isDistrictMatch || isDeptMatch || isCompositeMatch;
    } catch (e) {
      return true; // If parsing fails, default to visible
    }
  });
}

module.exports = filterByOffice;
