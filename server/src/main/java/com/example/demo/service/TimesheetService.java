package com.example.demo.service;

import com.example.demo.dto.TimesheetMonthViewDTO;
import com.example.demo.entity.Timesheet;
import com.example.demo.entity.Employee;
import com.example.demo.repository.TimesheetRepository;
import com.example.demo.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Duration;
import java.util.*;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimesheetService {

    private static final Logger logger = LoggerFactory.getLogger(TimesheetService.class);
    
    private final TimesheetRepository timesheetRepository;
    private final EmployeeRepository employeeRepository;

    public List<TimesheetMonthViewDTO> getMonthView(int year, int month) {
        try {
            LocalDate start = LocalDate.of(year, month, 1);
            LocalDate end = start.plusMonths(1).minusDays(1);
            
            logger.info("Fetching timesheets for year: {}, month: {}, date range: {} to {}", year, month, start, end);

            List<Timesheet> raw = timesheetRepository.findByDateBetween(start, end);
            logger.info("Found {} timesheets", raw.size());

            Map<Long,List<Timesheet>> grouped =
                    raw.stream().collect(Collectors.groupingBy(Timesheet::getEmployeeId));

            List<TimesheetMonthViewDTO> result = new ArrayList<>();

            for (Long empId : grouped.keySet()) {
                try {
                    Employee emp = employeeRepository.findById(empId).orElse(null);
                    if (emp == null) {
                        logger.warn("Employee not found with ID: {}", empId);
                        continue;
                    }

                    String fullName = emp.getFName() + " "
                            + (emp.getMName() != null ? emp.getMName() + " " : "")
                            + emp.getLName();
                    String type = emp.getType();

                    Map<String, String> dayMap = new LinkedHashMap<>();
                    double totalHours = 0;
                    double totalOT = 0;

                    List<Timesheet> sheets = grouped.get(empId);

                    for (LocalDate day = start; !day.isAfter(end); day = day.plusDays(1)) {
                        LocalDate finalDay = day;

                        var opt = sheets.stream()
                                .filter(ts -> ts.getDate().equals(finalDay))
                                .findFirst();

                        if (opt.isPresent()) {
                            Timesheet ts = opt.get();
                            var in = ts.getCheckIn();
                            var out = ts.getCheckOut();

                            if (in != null && out != null) {
                                double hours = Duration.between(in, out).toMinutes() / 60.0 - 1;
                                totalHours += hours;

                                if ("Fulltime".equalsIgnoreCase(type)) {
                                    totalOT += Math.max(0, hours - 8);
                                }

                                String inTime = in.toString().substring(11, 16);
                                String outTime = out.toString().substring(11, 16);
                                dayMap.put(finalDay.toString(), inTime + "-" + outTime);
                            } else {
                                dayMap.put(finalDay.toString(), "-");
                            }
                        } else {
                            dayMap.put(finalDay.toString(), "-");
                        }
                    }

                    TimesheetMonthViewDTO dto = new TimesheetMonthViewDTO();
                    dto.setEmployeeId(emp.getId().intValue());
                    dto.setEmployeeName(fullName);
                    dto.setEmployeeType(type);
                    dto.setTotalHours(totalHours);
                    dto.setTotalOvertime(totalOT);
                    dto.setDays(dayMap);
                    result.add(dto);
                } catch (Exception e) {
                    logger.error("Error processing employee {}", empId, e);
                }
            }

            return result;
        } catch (Exception e) {
            logger.error("Error in getMonthView", e);
            throw e;
        }
    }
}
